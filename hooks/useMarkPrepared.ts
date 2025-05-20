import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSquareOrder } from '@/lib/ssr-actions'
import type { Order } from '@/app/admin/kds/page'

export function useMarkPrepared() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (order: Order) => {
      await updateSquareOrder(order.id, order.locationId!, { state: 'PREPARED' })
    },
    onMutate: async (order) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] })

      const previousOrders = queryClient.getQueryData<Order[]>(['orders'])

      queryClient.setQueryData<Order[]>(['orders'], (old = []) =>
        old.map((o) => (o.id === order.id ? { ...o, fulfillmentStatus: 'PREPARED' } : o))
      )

      return { previousOrders }
    },
    onError: (_, __, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
