Utility function is located in @/app/utils/field-validation

1. Watch the field
   const myField = watch('myFieldName')

2. Extract schema from the shape
   const myFieldSchema = myFormSchema.shape.myFieldName

3. Validate in real-time
   const validation = validateField(myField, myFieldSchema)

4. Apply styling

```
  <div className={getFieldContainerClasses(
    getFieldState(myField, savedContent?.myFieldName, !validation.valid),
    !validation.valid
  )}>
    <Input {...register('myFieldName')} />
    {!validation.valid && validation.error && (
      <p className="text-sm font-medium text-red-600">{validation.error}</p>
    )}
  </div>
```
