import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import Preloader from './Preloader';

const FormBuilder = React.memo(({
  schema,
  onSubmit,
  onChange,
  className,
  loading = false,
  submitButton,
  submitButtonProps = {},
  submitButtonText = "Enviar",
  inputClassContainer,
  inputClassName,
  children
}) => {
  // Guardamos el schema localmente (para mutaciones dinámicas si existen)
  const [formSchema, setFormSchema] = useState(schema);

  // Inicializa los valores y campos tocados solo una vez
  const initialValues = useMemo(() => {
    const defaults = {};
    Object.entries(schema).forEach(([key, field]) => {
      defaults[key] = field.value ?? '';
    });
    return defaults;
  }, [schema]);

  const initialTouched = useMemo(() => {
    const defaults = {};
    Object.entries(schema).forEach(([key, field]) => {
      if (field.type === 'radio') defaults[key] = true;
    });
    return defaults;
  }, [schema]);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(initialTouched);

  // Sincroniza schema dinámico (si cambia)
  useEffect(() => {
    setFormSchema(schema);
    setValues((prevValues) => {
      const newValues = { ...prevValues };

      Object.entries(schema).forEach(([key, field]) => {
        // Si el campo aún no tiene valor, y el schema sí trae uno nuevo desde la base de datos
        if ((newValues[key] === '' || newValues[key] === undefined) && field.value !== undefined) {
          newValues[key] = field.value;
        }

        // Para radios, si hay opciones y no hay valor actual
        if (field.type === 'radio' && !newValues[key]) {
          if (field.value) newValues[key] = field.value;
          else if (field.options?.length) newValues[key] = field.options[0].value;
        }
      });

      return newValues;
    });
  }, [schema]);

  // ✅ Handler optimizado: memoizado y con validación única
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));

    const field = formSchema[name];
    if (!field) return;

    if (field.validation) {
      const result = field.validation(value);
      setErrors((prev) => ({
        ...prev,
        [name]: result === true ? '' : result
      }));
    } else if (field.required && !value) {
      setErrors((prev) => ({
        ...prev,
        [name]: 'Campo requerido'
      }));
    }
    if(onChange)
      onChange({ ...values, [name]: value });
  }, [formSchema]);

  // ✅ Blur handler: marca como tocado y valida
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;

    setTouched((prev) => {
      if (prev[name]) return prev;
      return { ...prev, [name]: true };
    });

    const field = formSchema[name];
    if (!field) return;

    if (field.validation) {
      const result = field.validation(value);
      setErrors((prev) => ({
        ...prev,
        [name]: result === true ? '' : result
      }));
    } else if (field.required && !value) {
      setErrors((prev) => ({
        ...prev,
        [name]: 'Campo requerido'
      }));
    }
  }, [formSchema]);

  // ✅ Submit handler: limpio y sin recalcular cosas fuera del scope
  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const newErrors = {};
    let isValid = true;

    Object.entries(formSchema).forEach(([key, field]) => {
      const value = values[key];
      if (field.required && !value) {
        newErrors[key] = 'Campo requerido';
        isValid = false;
      } else if (field.validation) {
        const result = field.validation(value || '');
        if (result !== true) {
          newErrors[key] = result;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    if (isValid) onSubmit(values);
  }, [formSchema, values, onSubmit]);

  // ✅ Render optimizado: useMemo para evitar recalcular fields
  const fields = useMemo(() =>
    Object.entries(formSchema).map(([key, field]) => {
      const commonProps = {
        name: key,
        value: values[key] ?? field.value ?? '',
        onChange: handleChange,
        onBlur: handleBlur,
        errorMessage: errors[key],
        ...field,
      };
      if (field.type == 'space') {
        return <div key={key}></div>
      }
      return (
        <div key={key}>
          {
            field.type === 'select'
              ? <Select {...commonProps} />
              : <Input {...commonProps} inputClassContainer={inputClassContainer} inputClassName={inputClassName} />
          }
        </div>
      )
    }),
    [formSchema, values, errors, handleChange, handleBlur, inputClassContainer]);


  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {fields}
      {children}

      {submitButton ? (
        submitButton
      ) : (
        <Button {...submitButtonProps} disabled={loading}>
          {loading ? <Preloader /> : submitButtonText}
        </Button>
      )}
    </form>
  );
});

export default FormBuilder;