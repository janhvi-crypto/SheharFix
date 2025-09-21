// import React, { createContext, useContext, useState, useEffect } from 'react';

// export type Language = 'en' | 'hi' | 'mr';
// export type UserRole = 'citizen' | 'admin';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   avatar?: string;
//   points?: number;
//   level?: number;
//   badges?: string[];
// }

// interface AppContextType {
//   user: User | null;
//   language: Language;
//   setLanguage: (lang: Language) => void;
//   login: (email: string, password: string, role: UserRole) => Promise<boolean>;
//   logout: () => void;
//   isLoading: boolean;
//   isNavigating: boolean;
//   setIsNavigating: (loading: boolean) => void;
// }

// const AppContext = createContext<AppContextType | undefined>(undefined);

// const translations = {
//   en: {
//     chooseRole: "Choose Role",
//     citizen: "Citizen",
//     administrator: "Administrator",
//     continueAsCitizen: "Continue as Citizen",
//     continueAsAdmin: "Continue as Admin",
//     reportIssues: "Report civic issues with photos",
//     trackProgress: "Track issue resolution progress",
//     earnPoints: "Earn points and badges",
//     voiceReporting: "Voice-enabled reporting",
//     manageIssues: "Manage and resolve issues",
//     accessAnalytics: "Access heatmap and analytics",
//     uploadPhotos: "Upload before/after photos",
//     navigateLocations: "Navigate to issue locations",
//     findItFlagItFixIt: "Find It, Flag It, Fix It",
//     loadingDashboard: "Loading your dashboard...",
//     welcome: "Welcome to SheharFix",
//     login: "Login",
//     email: "Email",
//     password: "Password",
//     dashboard: "Dashboard",
//     reportIssue: "Report Issue",
//     analytics: "Analytics",
//     leaderboard: "Leaderboard",
//     profile: "Profile",
//     transparency: "Transparency",
//     publicView: "Public View",
//   logout: "Logout",
//   signOut: "Sign Out"
//   },
//   hi: {
//     chooseRole: "भूमिका चुनें",
//     citizen: "नागरिक",
//     administrator: "प्रशासक",
//     continueAsCitizen: "नागरिक के रूप में जारी रखें",
//     continueAsAdmin: "प्रशासक के रूप में जारी रखें",
//     reportIssues: "फोटो के साथ नागरिक समस्याओं की रिपोर्ट करें",
//     trackProgress: "मुद्दे के समाधान की प्रगति को ट्रैक करें",
//     earnPoints: "अंक और बैज अर्जित करें",
//     voiceReporting: "आवाज-सक्षम रिपोर्टिंग",
//     manageIssues: "मुद्दों का प्रबंधन और समाधान करें",
//     accessAnalytics: "हीटमैप और एनालिटिक्स तक पहुंच",
//     uploadPhotos: "पहले/बाद की तस्वीरें अपलोड करें",
//     navigateLocations: "मुद्दे के स्थानों पर नेविगेट करें",
//     findItFlagItFixIt: "इसे खोजें, इसे फ्लैग करें, इसे ठीक करें",
//     loadingDashboard: "आपका डैशबोर्ड लोड हो रहा है...",
//     welcome: "SheharFix में आपका स्वागत है",
//     login: "लॉगिन",
//     email: "ईमेल",
//     password: "पासवर्ड",
//     dashboard: "डैशबोर्ड",
//     reportIssue: "समस्या की रिपोर्ट करें",
//     analytics: "एनालिटिक्स",
//     leaderboard: "लीडरबोर्ड",
//     profile: "प्रोफ़ाइल",
//     transparency: "पारदर्शिता",
//     publicView: "सार्वजनिक दृश्य",
//   logout: "लॉगआउट",
//   signOut: "साइन आउट"
//   },
//   mr: {
//     chooseRole: "भूमिका निवडा",
//     citizen: "नागरिक",
//     administrator: "प्रशासक",
//     continueAsCitizen: "नागरिक म्हणून सुरू ठेवा",
//     continueAsAdmin: "प्रशासक म्हणून सुरू ठेवा",
//     reportIssues: "फोटोसह नागरी समस्यांचा अहवाल द्या",
//     trackProgress: "समस्या निराकरणाची प्रगती ट्रॅक करा",
//     earnPoints: "गुण आणि बॅज मिळवा",
//     voiceReporting: "आवाज-सक्षम अहवाल",
//     manageIssues: "समस्यांचे व्यवस्थापन आणि निराकरण करा",
//     accessAnalytics: "हीटमॅप आणि अॅनालिटिक्स अॅक्सेस करा",
//     uploadPhotos: "आधी/नंतरचे फोटो अपलोड करा",
//     navigateLocations: "समस्या स्थानांवर नेव्हिगेट करा",
//     findItFlagItFixIt: "शोधा, चिन्हांकित करा, दुरुस्त करा",
//     loadingDashboard: "तुमचे डॅशबोर्ड लोड होत आहे...",
//     welcome: "SheharFix मध्ये आपले स्वागत आहे",
//     login: "लॉगिन",
//     email: "ईमेल",
//     password: "पासवर्ड",
//     dashboard: "डॅशबोर्ड",
//     reportIssue: "समस्या कळवा",
//     analytics: "अॅनालिटिक्स",
//     leaderboard: "लीडरबोर्ड",
//     profile: "प्रोफाइल",
//     transparency: "पारदर्शकता",
//     publicView: "सार्वजनिक दृश्य",
//   logout: "लॉगआउट",
//   signOut: "साइन आउट"
//   }
// };

// export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [language, setLanguage] = useState<Language>('en');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isNavigating, setIsNavigating] = useState(false);

//   useEffect(() => {
//     // Load saved language and user from localStorage
//     const savedLang = localStorage.getItem('sheharfix-language') as Language;
//     const savedUser = localStorage.getItem('sheharfix-user');
    
//     if (savedLang) setLanguage(savedLang);
//     if (savedUser) setUser(JSON.parse(savedUser));
    
//     // Simulate loading time
//     setTimeout(() => setIsLoading(false), 2000);
//   }, []);

//   const handleSetLanguage = (lang: Language) => {
//     setLanguage(lang);
//     localStorage.setItem('sheharfix-language', lang);
//   };

//   const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
//     // Mock authentication
//     if (email && password) {
//       const mockUser: User = {
//         id: Math.random().toString(36).substr(2, 9),
//         name: role === 'citizen' ? 'Priya Sharma' : 'Rajesh Kumar',
//         email,
//         role,
//         avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
//         points: role === 'citizen' ? 1247 : undefined,
//         level: role === 'citizen' ? 5 : undefined,
//         badges: role === 'citizen' ? ['Street Guardian', 'Voice of Change'] : undefined
//       };
      
//       setUser(mockUser);
//       localStorage.setItem('sheharfix-user', JSON.stringify(mockUser));
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('sheharfix-user');
//   };

//   return (
//     <AppContext.Provider value={{
//       user,
//       language,
//       setLanguage: handleSetLanguage,
//       login,
//       logout,
//       isLoading,
//       isNavigating,
//       setIsNavigating
//     }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useApp = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error('useApp must be used within AppProvider');
//   }
//   return context;
// };

// export const useTranslation = () => {
//   const { language } = useApp();
//   return {
//     t: (key: keyof typeof translations.en) => translations[language][key] || translations.en[key],
//     language
//   };
// };
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr';
export type UserRole = 'citizen' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  points?: number;
  level?: number;
  badges?: string[];
}

interface AppContextType {
  user: User | null;
  token: string | null; // Added token to context
  language: Language;
  setLanguage: (lang: Language) => void;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isNavigating: boolean;
  setIsNavigating: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations = {
  en: {
    chooseRole: "Choose Role",
    citizen: "Citizen",
    administrator: "Administrator",
    continueAsCitizen: "Continue as Citizen",
    continueAsAdmin: "Continue as Admin",
    reportIssues: "Report civic issues with photos",
    trackProgress: "Track issue resolution progress",
    earnPoints: "Earn points and badges",
    voiceReporting: "Voice-enabled reporting",
    manageIssues: "Manage and resolve issues",
    accessAnalytics: "Access heatmap and analytics",
    uploadPhotos: "Upload before/after photos",
    navigateLocations: "Navigate to issue locations",
    findItFlagItFixIt: "Find It, Flag It, Fix It",
    loadingDashboard: "Loading your dashboard...",
    welcome: "Welcome to SheharFix",
    login: "Login",
    email: "Email",
    password: "Password",
    dashboard: "Dashboard",
    reportIssue: "Report Issue",
    analytics: "Analytics",
    leaderboard: "Leaderboard",
    profile: "Profile",
    transparency: "Transparency",
    publicView: "Public View",
  logout: "Logout",
  signOut: "Sign Out"
  },
  hi: {
    chooseRole: "भूमिका चुनें",
    citizen: "नागरिक",
    administrator: "प्रशासक",
    continueAsCitizen: "नागरिक के रूप में जारी रखें",
    continueAsAdmin: "प्रशासक के रूप में जारी रखें",
    reportIssues: "फोटो के साथ नागरिक समस्याओं की रिपोर्ट करें",
    trackProgress: "मुद्दे के समाधान की प्रगति को ट्रैक करें",
    earnPoints: "अंक और बैज अर्जित करें",
    voiceReporting: "आवाज-सक्षम रिपोर्टिंग",
    manageIssues: "मुद्दों का प्रबंधन और समाधान करें",
    accessAnalytics: "हीटमैप और एनालिटिक्स तक पहुंच",
    uploadPhotos: "पहले/बाद की तस्वीरें अपलोड करें",
    navigateLocations: "मुद्दे के स्थानों पर नेविगेट करें",
    findItFlagItFixIt: "इसे खोजें, इसे फ्लैग करें, इसे ठीक करें",
    loadingDashboard: "आपका डैशबोर्ड लोड हो रहा है...",
    welcome: "SheharFix में आपका स्वागत है",
    login: "लॉगिन",
    email: "ईमेल",
    password: "पासवर्ड",
    dashboard: "डैशबोर्ड",
    reportIssue: "समस्या की रिपोर्ट करें",
    analytics: "एनालिटिक्स",
    leaderboard: "लीडरबोर्ड",
    profile: "प्रोफ़ाइल",
    transparency: "पारदर्शिता",
    publicView: "सार्वजनिक दृश्य",
  logout: "लॉगआउट",
  signOut: "साइन आउट"
  },
  mr: {
    chooseRole: "भूमिका निवडा",
    citizen: "नागरिक",
    administrator: "प्रशासक",
    continueAsCitizen: "नागरिक म्हणून सुरू ठेवा",
    continueAsAdmin: "प्रशासक म्हणून सुरू ठेवा",
    reportIssues: "फोटोसह नागरी समस्यांचा अहवाल द्या",
    trackProgress: "समस्या निराकरणाची प्रगती ट्रॅक करा",
    earnPoints: "गुण आणि बॅज मिळवा",
    voiceReporting: "आवाज-सक्षम अहवाल",
    manageIssues: "समस्यांचे व्यवस्थापन आणि निराकरण करा",
    accessAnalytics: "हीटमॅप आणि अॅनालिटिक्स अॅक्सेस करा",
    uploadPhotos: "आधी/नंतरचे फोटो अपलोड करा",
    navigateLocations: "समस्या स्थानांवर नेव्हिगेट करा",
    findItFlagItFixIt: "शोधा, चिन्हांकित करा, दुरुस्त करा",
    loadingDashboard: "तुमचे डॅशबोर्ड लोड होत आहे...",
    welcome: "SheharFix मध्ये आपले स्वागत आहे",
    login: "लॉगिन",
    email: "ईमेल",
    password: "पासवर्ड",
    dashboard: "डॅशबोर्ड",
    reportIssue: "समस्या कळवा",
    analytics: "अॅनालिटिक्स",
    leaderboard: "लीडरबोर्ड",
    profile: "प्रोफाइल",
    transparency: "पारदर्शकता",
    publicView: "सार्वजनिक दृश्य",
  logout: "लॉगआउट",
  signOut: "साइन आउट"
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // Added token state
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('sheharfix-user');
    const savedToken = localStorage.getItem('sheharfix-token'); // Load token
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setToken(savedToken); // Set loaded token
    
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('sheharfix-language', lang);
  };

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    if (email && password) {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: role === 'citizen' ? 'Priya Sharma' : 'Rajesh Kumar',
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        points: role === 'citizen' ? 1247 : undefined,
        level: role === 'citizen' ? 5 : undefined,
        badges: role === 'citizen' ? ['Street Guardian', 'Voice of Change'] : undefined
      };

      const mockToken = 'mock-jwt-token-for-testing'; // Create a mock token

      setUser(mockUser);
      setToken(mockToken); // Set the token
      localStorage.setItem('sheharfix-user', JSON.stringify(mockUser));
      localStorage.setItem('sheharfix-token', mockToken); // Save the token
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null); // Clear the token
    localStorage.removeItem('sheharfix-user');
    localStorage.removeItem('sheharfix-token'); // Remove the token
  };

  return (
    <AppContext.Provider value={{
      user,
      token, // Provide token in context
      language,
      setLanguage: handleSetLanguage,
      login,
      logout,
      isLoading,
      isNavigating,
      setIsNavigating
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { language } = useApp();
  return {
    t: (key: keyof typeof translations.en) => translations[language][key] || translations.en[key],
    language
  };
};