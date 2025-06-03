import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSquareOrder } from '@/lib/ssr-actions'
import type { Order } from '@/types'

export function useMarkPrepared(merchantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (order: Order) => {
      await updateSquareOrder(order.id, order.locationId!, { state: 'PREPARED' }, merchantId)
    },
    onMutate: async (order) => {
      const key = ['orders', merchantId, order.locationId]
      const previous = queryClient.getQueryData<Order[]>(key)
      queryClient.setQueryData<Order[]>(key, (old = []) => old.filter((o) => o.id !== order.id))
      return { previous, key }
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous && ctx?.key) {
        queryClient.setQueryData(ctx.key, ctx.previous)
      }
    },
    onSettled: (_, __, ____, ctx) => {
      if (ctx?.key) {
        queryClient.invalidateQueries({ queryKey: ctx.key })
      }
    },
  })
}
