import { ActionState, FieldErrors } from "@/lib/create-safe-action";
import { useCallback, useState } from "react";

type Action<TInput, TOutput> = (
  input: TInput
) => Promise<ActionState<TInput, TOutput>>;

interface UseAction<TInput, TOutput> {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onCompleted?: () => void;
}

export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options?: UseAction<TInput, TOutput>
) => {
  const [data, setData] = useState<TOutput | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<TInput | undefined>
  >({});

  const execute = useCallback(
    async (input: TInput) => {
      setIsLoading(true);

      try {
        const result = await action(input);

        if (!result) return;

        setFieldErrors(result.fieldErrors);

        if (result.error) {
          setError(result.error);
          options?.onError?.(result.error);
        }
        if (result.data) {
          options?.onSuccess?.(result.data);
          setData(result.data);
        }
      } finally {
        options?.onCompleted?.();
        setIsLoading(false);
      }
    },
    [action, options]
  );

  return { execute, data, error, isLoading, fieldErrors };
};
