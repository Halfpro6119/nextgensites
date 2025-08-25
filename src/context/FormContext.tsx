import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FormData {
  // Onboarding form data
  businessName?: string;
  businessDescription?: string;
  goals?: string[];
  otherGoal?: string;
  designStyle?: string;
  currentWebsite?: string;
  inspirationSites?: string;
  desiredPages?: string;
  avoidFeatures?: string;
  budget?: string;
  additionalInfo?: string;
  
  // Selected package
  selectedPackage?: {
    id: string;
    title: string;
    price: string;
    description: string;
    features: string[];
    buttonText: string;
  };

  // Contact form data
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  question?: string;
  automations?: string;
  source?: string;
}

interface FormContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  clearFormData: () => void;
  saveFormField: (field: string, value: any) => void;
  isLoaded: boolean;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const STORAGE_KEY = 'webdesign_form_data';

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      }
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form data to localStorage:', error);
      }
    }
  }, [formData, isLoaded]);

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  const saveFormField = (field: string, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const clearFormData = () => {
    setFormData({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing form data from localStorage:', error);
    }
  };

  return (
    <FormContext.Provider value={{ 
      formData, 
      updateFormData, 
      clearFormData, 
      saveFormField,
      isLoaded 
    }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}