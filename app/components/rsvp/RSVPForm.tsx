import { RSVP } from '@/app/models/rsvp';
import { useForm } from 'react-hook-form';
import { addRSVP } from './action';
import SubmitButton from '../SubmitButton';
import { useSnackbar } from 'notistack';

const RSVPForm = ({ guestName, rsvp }: { guestName: string; rsvp?: RSVP }) => {
    const { enqueueSnackbar } = useSnackbar();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<RSVP>({
        defaultValues: {
            name: guestName,
        },
    });
    const onSubmit = async (data: any) => {
        try {
            await addRSVP(data);
            enqueueSnackbar('Successfuly submitted the form. Thank you for submitting!', { variant: 'success' });
        } catch (error) {
            console.error('Error submitting form:', error);
            enqueueSnackbar(`Error submitting form: ${error}`, { variant: 'error' });
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex-col flex gap-2 text-left">
            <input readOnly className="w-full" {...register('name', { required: true })} />
            <label htmlFor="guest_number">Number of guest&#40;s&#41;</label>
            <select
                id="guest_number"
                className="w-full"
                {...register('guest_number', { required: true })}
                defaultValue={rsvp?.guest_number ?? 1}
            >
                <option value={1}>1</option>
                <option value={2}>2</option>
            </select>
            <label htmlFor="attending">Are you attending?</label>
            <select
                id="attending"
                className="w-full"
                {...register('attend', { required: true })}
                defaultValue={rsvp?.attend ?? 'yes'}
            >
                <option value={'yes'}>Yes</option>
                <option value={'no'}>No</option>
            </select>
            <label htmlFor="notes">Chef notes</label>
            <textarea
                id="notes"
                {...register('notes')}
                rows={3}
                placeholder="Please tell us if you have any allergies or if you are a vegetarian/vegan. Otherwise please leave it
                empty :D"
            >
                {rsvp?.notes ?? ''}
            </textarea>
            <div id="spacer" className="p-1" />
            <SubmitButton isSubmitting={isSubmitting} />
        </form>
    );
};

export default RSVPForm;
