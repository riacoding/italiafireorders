type Modifier = {
  name: string
  quantity: number
  price: number
}

type ReceiptItem = {
  name: string
  quantity: number
  modifiers: Modifier[]
}

type Props = {
  items: ReceiptItem[]
}

export const ReceiptSimpleList: React.FC<Props> = ({ items }) => {
  return (
    <div className=' flex flex-col items-center font-mono text-sm'>
      {items.map((item, idx) => (
        <div key={idx} className='mb-2'>
          <div>
            {item.quantity} x {item.name}
          </div>

          {item.modifiers?.length > 0 && (
            <div className='ml-4 text-gray-600 text-left'>
              {item.modifiers.map((mod, mIdx) => (
                <div key={mIdx}>+ {mod.name}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
