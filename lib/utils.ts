import { NormalizedItem, SquareItem, SquareModifierList } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeSquareItem({
  item,
  modifierLists,
}: {
  item: SquareItem
  modifierLists: SquareModifierList[]
}): NormalizedItem {
  console.log('group:', JSON.stringify(modifierLists[0], null, 2))
  console.log('MODIFIER LIST DEBUG:')
  modifierLists.forEach((group, i) => {
    console.log(`Group ${i}:`, group.modifier_list_data?.name)
    console.log(`Group ${i}:`, group.id)
    const mods = group.modifier_list_data?.modifiers
    if (!mods) {
      console.log('⚠️ No modifiers array')
    } else {
      console.log(`→ Found ${mods.length} modifiers`)
      mods.forEach((mod, j) => {
        console.log(`   - Mod ${j}:`, mod?.modifier_data?.name)
      })
    }
  })
  return {
    id: item.id,
    name: item.item_data.name,
    description: item.item_data.description,
    price: item.item_data.variations?.[0]?.item_variation_data?.price_money?.amount ?? 0,
    image: item.item_data.image_url ?? '/placeholder.svg',
    toppings: modifierLists.flatMap(
      (group) =>
        group.modifier_list_data?.modifiers?.map((mod) => ({
          id: mod.id,
          name: mod.modifier_data.name,
          price: mod.modifier_data.price_money?.amount ?? 0,
          groupName: group.modifier_list_data?.name ?? 'Modifiers',
          isDefault: mod.modifier_data.on_by_default ?? false,
          isLocked: false,
        })) ?? []
    ),
  }
}
