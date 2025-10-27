import { useState } from 'react'

import Alert from '@mui/material/Alert'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useSnackbar } from 'notistack'
import { Controller, useForm } from 'react-hook-form'

import { addParticipant } from '@/app/dashboard/action'
import CheckIcon from '@/app/icons/CheckIcon'
import CrossIcon from '@/app/icons/CrossIcon'
import { RSVPForm } from '@/app/models/rsvp'
import { useLocation } from '@/app/utils/useLocation'

import Button from '../Button'
import FadeIn from '../FadeIn'
import SubmitButton from '../SubmitButton'

const RSVPFORM = ({ rsvp }: { rsvp: RSVPForm }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [showForm, setShowForm] = useState<boolean>(!Boolean(rsvp?.attend))
  const { location } = useLocation()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<RSVPForm>({
    defaultValues: {
      id: rsvp.id,
      name: rsvp.name,
      attend: rsvp.attend ?? 'yes',
      notes: rsvp.notes ?? '',
      food_choice: rsvp.location === 'bali' ? (rsvp.food_choice ?? 'chicken') : undefined,
      location: rsvp.location,
      max_guests: rsvp.max_guests,
    },
  })
  const onSubmit = async (data: any) => {
    try {
      await addParticipant(data)
      enqueueSnackbar('Successfuly submitted the form. Thank you for submitting!', {
        variant: 'success',
      })
      setShowForm(false)
    } catch (error) {
      console.error('Error submitting form:', error)
      enqueueSnackbar(`Error submitting form: ${error}`, { variant: 'error' })
    }
  }
  const handleChangeClick = () => {
    setShowForm(true)
  }

  return !showForm ? (
    <div className="flex flex-col gap-4">
      {rsvp?.attend === 'no' ? (
        <>
          <Alert icon={<CrossIcon />} severity="error" className="self-center">
            <p className="text-lg font-semibold">Unable to attend</p>
          </Alert>
          <p>Sad to know that you can&apos;t attend.. Hope to see you on another chance! ;&#41;</p>
          <div>
            <Button onClick={handleChangeClick}>Change answer</Button>
          </div>
        </>
      ) : (
        <>
          <Alert icon={<CheckIcon />} severity="success" className="self-center">
            <p className="text-lg font-semibold">Will attend</p>
          </Alert>
          <p>
            We are delighted to know that you will be there on our special day! See you on our
            wedding day! :D
          </p>
          <div>
            <Button onClick={handleChangeClick}>Change answer</Button>
          </div>
        </>
      )}
    </div>
  ) : (
    <>
      {location !== 'jakarta' && (
        <FadeIn className="mb-4">
          Please confirm your attendance before:
          <br />
          {location === 'bali' ? (
            <>
              July 9<sup>th</sup>, 2025
            </>
          ) : (
            <>
              August 20<sup>th</sup>, 2025
            </>
          )}
        </FadeIn>
      )}

      <FadeIn>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-left">
          <TextField
            className="w-full"
            {...register('name', { required: true })}
            label="Name (readonly)"
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />
          <TextField
            select
            id="guest_number"
            className="w-full"
            label="Number of guest(s) including you"
            {...register('guest_number', { required: true })}
            defaultValue={rsvp?.guest_number ?? 1}
          >
            {Array.from({ length: rsvp?.max_guests ?? 2 }, (_, i) => (
              <MenuItem key={i} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            id="attending"
            className="w-full"
            label="Will you attend?"
            {...register('attend', { required: true })}
            defaultValue={rsvp?.attend ?? 'yes'}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>
          {location === 'bali' && (
            <>
              <Controller
                name="food_choice"
                control={control}
                rules={{ required: 'Must be selected' }}
                render={({ field }) => (
                  <FormControl>
                    <FormLabel id="row-radio-buttons-group-label" className="mb-2">
                      Choose your main course
                    </FormLabel>
                    <RadioGroup row aria-labelledby="row-radio-buttons-group-label" {...field}>
                      <FormControlLabel
                        value="chicken"
                        control={<Radio />}
                        label={
                          <p className="text-sm">
                            Baked chicken leg wrapped in puff pastry with mushroom sauce
                          </p>
                        }
                      />
                      <FormControlLabel
                        value="lamb"
                        control={<Radio />}
                        label={
                          <p className="text-sm">Roasted lamb chop with miso and herb butter</p>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />
              <TextField
                id="notes"
                label="Chef notes"
                multiline
                minRows={3}
                maxRows={8}
                {...register('notes')}
                defaultValue={rsvp?.notes ?? ''}
                helperText="Please tell us if you have any allergies or if you are a vegetarian / vegan (main course selection will be ignored). Otherwise please leave it empty :D"
              />
            </>
          )}
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </FadeIn>
    </>
  )
}

export default RSVPFORM
