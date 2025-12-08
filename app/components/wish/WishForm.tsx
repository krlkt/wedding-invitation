import TextField from '@mui/material/TextField'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'

import { Wish } from '@/app/models/wish'
import { useGuestId } from '@/app/hooks/useGuestId'

import SubmitButton from '../SubmitButton'

import { addWish } from './action'

type WishFormType = Omit<Wish, 'created_at'>

const WishForm = ({ guestName }: { guestName: string }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useGuestId()

  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<WishFormType>({
    defaultValues: {
      name: guestName,
      created_by_id: id,
    },
  })
  const onSubmit = async (data: any) => {
    try {
      await addWish(data)
      reset() // Reset the form fields after successful submission
      enqueueSnackbar('Thank you for your wishes! 💕', { variant: 'success' })
    } catch (error) {
      console.error('Error submitting form:', error)
      enqueueSnackbar(`Error submitting form: ${error}`, { variant: 'error' })
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <TextField
          placeholder="Name"
          className="w-full"
          {...register('name', { required: true })}
          type="text"
          label="Name"
        />
        <TextField
          label="Message"
          multiline
          minRows={4}
          placeholder="Write your beautiful message here.."
          className="w-full"
          {...register('wish', { required: true })}
        />
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </div>
  )
}

export default WishForm
