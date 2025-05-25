import { RSVPForm } from '@/app/models/rsvp';
import { useForm } from 'react-hook-form';
import SubmitButton from '../SubmitButton';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import Button from '../Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useLocation } from '@/app/utils/useLocation';
import { addParticipant } from '@/app/dashboard/action';

const RSVPFORM = ({ rsvp }: { rsvp: RSVPForm }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [showForm, setShowForm] = useState<boolean>(!Boolean(rsvp?.attend));
    const { location } = useLocation();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<RSVPForm>({
        defaultValues: {
            id: rsvp.id,
            name: rsvp.name,
            attend: rsvp.attend ?? '1',
            notes: rsvp.notes ?? '',
            location: rsvp.location,
            max_guests: rsvp.max_guests,
        },
    });
    const onSubmit = async (data: any) => {
        try {
            await addParticipant(data);
            enqueueSnackbar('Successfuly submitted the form. Thank you for submitting!', { variant: 'success' });
            setShowForm(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            enqueueSnackbar(`Error submitting form: ${error}`, { variant: 'error' });
        }
    };

    const handleChangeClick = () => {
        setShowForm(true);
    };

    return !showForm ? (
        <div className="flex flex-col gap-4">
            {rsvp?.attend === 'no' ? (
                <>
                    <p className="text-2xl font-bold">Unable to attend</p>
                    <p>Sad to know that you can&apos;t attend.. Hope to see you on another chance! ;&#41;</p>
                    <div>
                        <Button onClick={handleChangeClick}>Change answer</Button>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-2xl font-bold">Will attend</p>
                    <p>
                        We are delighted to know that you will be there on our special day! See you on our wedding day!
                        :D
                    </p>
                    <div>
                        <Button onClick={handleChangeClick}>Change answer</Button>
                    </div>
                </>
            )}
        </div>
    ) : (
        <>
            <p>
                Please confirm your attendance before:
                <br />
                Aug 1<sup>st</sup>, 2025
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-col flex gap-4 text-left">
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
                        <MenuItem value={i + 1}>{i + 1}</MenuItem>
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
                    <MenuItem value={'yes'}>Yes</MenuItem>
                    <MenuItem value={'no'}>No</MenuItem>
                </TextField>
                {location === 'bali' && (
                    <TextField
                        id="notes"
                        label="Chef notes"
                        multiline
                        minRows={3}
                        maxRows={8}
                        {...register('notes')}
                        defaultValue={rsvp?.notes ?? ''}
                        helperText="Please tell us if you have any allergies or if you are a vegetarian/vegan. Otherwise please leave itempty :D"
                    />
                )}
                <SubmitButton isSubmitting={isSubmitting} />
            </form>
        </>
    );
};

export default RSVPFORM;
