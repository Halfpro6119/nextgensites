import { useEffect, useRef } from 'react';
import { useFormContext } from '../context/FormContext';

interface UseFormPersistenceOptions {
  formName: string;
  debounceMs?: number;
}

export function useFormPersistence({ formName, debounceMs = 500 }: UseFormPersistenceOptions) {
  const { saveFormField, isLoaded } = useFormContext();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const saveField = (fieldName: string, value: any) => {
    if (!isLoaded) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      saveFormField(fieldName, value);
      console.log(`Saved ${formName}.${fieldName}:`, value);
    }, debounceMs);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { saveField };
}

export default useFormPersistence;