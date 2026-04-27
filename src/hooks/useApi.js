import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export function useApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (apiCall, options = {}) => {
        const {
            onSuccess,
            onError,
            successMessage,
            showError = true
        } = options;

        setLoading(true);
        setError(null);

        try {
            const response = await apiCall();
            const data = response.data;

            if (successMessage) {
                toast.success(successMessage);
            }

            if (onSuccess) {
                onSuccess(data.data);
            }

            return data.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || err.message || 'Something went wrong';

            setError(errorMessage);

            if (showError) {
                toast.error(errorMessage);
            }

            if (onError) {
                onError(err);
            }

            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, execute };
}