"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import {
  FieldApi,
  useField,
  useForm,
} from "@tanstack/react-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/Label"

type FormContextValue<TFormData> = {
  form: ReturnType<typeof useForm<TFormData>>
}

const FormContext = React.createContext<FormContextValue<any> | null>(null)

export const useFormContext = <TFormData,>() => {
  const context = React.useContext(FormContext)
  if (!context) {
    throw new Error("useFormContext must be used within <Form>")
  }
  return context as FormContextValue<TFormData>
}

export const Form = <TFormData extends Record<string, any>>({
  children,
  form,
  ...props
}: {
  children: React.ReactNode
  form: ReturnType<typeof useForm<TFormData>>
} & React.HTMLAttributes<HTMLFormElement>) => {
  return (
    <FormContext.Provider value={{ form }}>
      <form {...props} onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

type FormFieldProps<TFormData, TName extends keyof TFormData> = {
  name: TName
  children: (field: FieldApi<TFormData, TName>) => React.ReactNode
}

export const FormField = <TFormData extends Record<string, any>, TName extends keyof TFormData>({
  name,
  children,
}: FormFieldProps<TFormData, TName>) => {
  const { form } = useFormContext<TFormData>()
  const field = useField({
    form,
    name: name as any,
  })

  return <>{children(field as any)}</>
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

export const useFormField = () => {
  const itemContext = React.useContext(FormItemContext)

  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>")
  }

  const { id } = itemContext

  return {
    id,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
  }
}

export const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

export const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  const { formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={className}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

export const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={`${formDescriptionId} ${formMessageId}`}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement> & {
  message?: string
}

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ className, children, message, ...props }, ref) => {
  const { formMessageId } = useFormField()
  const body = message || children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-[var(--color-red)]", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"
