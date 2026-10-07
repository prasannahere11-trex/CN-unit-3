import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CityConfig, DeviceClassKey } from '../types';
import { SUITABILITY_CRITERIA } from '../data/suitabilityData';
import { calculateIPv4CityDeficit } from '../lib/ip/ipv4Math';
import { getIpv6CapacityMetrics } from '../lib/ip/ipv6Math';

export const DEFAULT_CONFIG: CityConfig = {
  districts: 16,
  devicesPerClass: {
    sensors: 150000,
    traffic: 2000,
    surveillance: 8000,
    emergency: 1500
  },
  growthRatePct: 15,
  planningHorizonYears: 10
};

interface CityContextType {
  config: CityConfig;
  updateConfig: (newConfig: Partial<CityConfig>) => void;
  updateDeviceCount: (deviceClass: DeviceClassKey, count: number) => void;
  resetToDefaults: () => void;
  suitabilityWeights: Record<string, number>;
  updateWeight: (id: string, weight: number) => void;
  resetWeights: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeDistrict: number;
  setActiveDistrict: (district: number) => void;
  activeService: string;
  setActiveService: (serviceCode: string) => void;
  activeZone: number;
  setActiveZone: (zone: number) => void;

  // Computed totals & statistics
  totalCurrentDevices: number;
  devicesByClass: Record<DeviceClassKey, number>;
  projectedGrowthDevices: number;
  ipv4DeficitInfo: ReturnType<typeof calculateIPv4CityDeficit>;
  ipv6Capacity: ReturnType<typeof getIpv6CapacityMetrics>;
  suitabilityScore: {
    ipv4Total: number;
    ipv6Total: number;
    ipv4WeightedPercent: number;
    ipv6WeightedPercent: number;
  };
}

const CityContext = createContext<CityContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_CONFIG = 'citynet_planner_config_v1';
const LOCAL_STORAGE_KEY_WEIGHTS = 'citynet_planner_weights_v1';
const LOCAL_STORAGE_KEY_THEME = 'citynet_planner_theme_v1';

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Config state
  const [config, setConfig] = useState<CityConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_CONFIG;
  });

  // Weights state
  const [suitabilityWeights, setSuitabilityWeights] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_WEIGHTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const defaults: Record<string, number> = {};
    SUITABILITY_CRITERIA.forEach(c => {
      defaults[c.id] = c.defaultWeight;
    });
    return defaults;
  });

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_THEME);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // fallback
    }
    return 'dark';
  });

  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeDistrict, setActiveDistrict] = useState<number>(1);
  const [activeService, setActiveService] = useState<string>('1');
  const [activeZone, setActiveZone] = useState<number>(1);

  // Sync to localStorage and HTML root class
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_WEIGHTS, JSON.stringify(suitabilityWeights));
    } catch {
      // ignore
    }
  }, [suitabilityWeights]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_THEME, theme);
    } catch {
      // ignore
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateConfig = (newConfig: Partial<CityConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig,
      devicesPerClass: {
        ...prev.devicesPerClass,
        ...(newConfig.devicesPerClass || {})
      }
    }));
  };

  const updateDeviceCount = (deviceClass: DeviceClassKey, count: number) => {
    setConfig(prev => ({
      ...prev,
      devicesPerClass: {
        ...prev.devicesPerClass,
        [deviceClass]: Math.max(0, count)
      }
    }));
  };

  const resetToDefaults = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const updateWeight = (id: string, weight: number) => {
    setSuitabilityWeights(prev => ({
      ...prev,
      [id]: Math.max(1, Math.min(10, weight))
    }));
  };

  const resetWeights = () => {
    const defaults: Record<string, number> = {};
    SUITABILITY_CRITERIA.forEach(c => {
      defaults[c.id] = c.defaultWeight;
    });
    setSuitabilityWeights(defaults);
  };

  // Computed Totals
  const devicesByClass = useMemo(() => {
    const perDistrict = config.devicesPerClass;
    const d = config.districts;
    return {
      sensors: perDistrict.sensors * d,
      traffic: perDistrict.traffic * d,
      surveillance: perDistrict.surveillance * d,
      emergency: perDistrict.emergency * d
    };
  }, [config]);

  const totalCurrentDevices = useMemo(() => {
    return (
      devicesByClass.sensors +
      devicesByClass.traffic +
      devicesByClass.surveillance +
      devicesByClass.emergency
    );
  }, [devicesByClass]);

  const projectedGrowthDevices = useMemo(() => {
    const rate = config.growthRatePct / 100;
    const compound = Math.pow(1 + rate, config.planningHorizonYears);
    return Math.round(totalCurrentDevices * compound);
  }, [totalCurrentDevices, config.growthRatePct, config.planningHorizonYears]);

  const ipv4DeficitInfo = useMemo(() => {
    return calculateIPv4CityDeficit(config.districts, config.devicesPerClass);
  }, [config.districts, config.devicesPerClass]);

  const ipv6Capacity = useMemo(() => {
    return getIpv6CapacityMetrics();
  }, []);

  const suitabilityScore = useMemo(() => {
    let totalWeight = 0;
    let ipv4ScoreSum = 0;
    let ipv6ScoreSum = 0;

    SUITABILITY_CRITERIA.forEach(c => {
      const weight = suitabilityWeights[c.id] ?? c.defaultWeight;
      totalWeight += weight;
      ipv4ScoreSum += c.ipv4Score * weight;
      ipv6ScoreSum += c.ipv6Score * weight;
    });

    const maxPossible = totalWeight * 10;
    const ipv4WeightedPercent = maxPossible > 0 ? (ipv4ScoreSum / maxPossible) * 100 : 0;
    const ipv6WeightedPercent = maxPossible > 0 ? (ipv6ScoreSum / maxPossible) * 100 : 0;

    return {
      ipv4Total: parseFloat((ipv4ScoreSum / totalWeight).toFixed(2)),
      ipv6Total: parseFloat((ipv6ScoreSum / totalWeight).toFixed(2)),
      ipv4WeightedPercent: parseFloat(ipv4WeightedPercent.toFixed(1)),
      ipv6WeightedPercent: parseFloat(ipv6WeightedPercent.toFixed(1))
    };
  }, [suitabilityWeights]);

  return (
    <CityContext.Provider
      value={{
        config,
        updateConfig,
        updateDeviceCount,
        resetToDefaults,
        suitabilityWeights,
        updateWeight,
        resetWeights,
        theme,
        toggleTheme,
        isSidebarCollapsed,
        setSidebarCollapsed,
        activeDistrict,
        setActiveDistrict,
        activeService,
        setActiveService,
        activeZone,
        setActiveZone,
        totalCurrentDevices,
        devicesByClass,
        projectedGrowthDevices,
        ipv4DeficitInfo,
        ipv6Capacity,
        suitabilityScore
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCityContext = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCityContext must be used within a CityProvider');
  }
  return context;
};
