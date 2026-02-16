import {type ClassValue, clsx} from 'clsx'
import {extendTailwindMerge} from 'tailwind-merge'

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{text: ['size-xl', 'size-lg', 'size-md', 'size-sm']}],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
