import { FC } from 'react'

import Button from './Button'
import Spinner from './Spinner'

interface SubmitButtonProps {
  isSubmitting: boolean
}

const SubmitButton: FC<SubmitButtonProps> = ({ isSubmitting }) => (
  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Submitting' : 'Submit'}
    {isSubmitting && (
      <div className="ml-2 inline-block w-4">
        <Spinner />
      </div>
    )}
  </Button>
)

export default SubmitButton
