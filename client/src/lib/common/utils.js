import { toast } from 'react-toastify'

export const classNames = (...classes) => {
	return classes.filter(Boolean).join(' ')
}

export const errorNotification = (error) => {
	if (Array.isArray(error.response.data.message)) {
		error.response.data.message.forEach((el) =>
			toast.error(el, {
				position: 'top-right',
			})
		)
	} else {
		toast.error(error.response.data.message, {
			position: 'top-right',
		})
	}
}
