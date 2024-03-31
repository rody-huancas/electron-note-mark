import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const dateFormat = new Intl.DateTimeFormat(window.context.locale, {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone : 'UTC'
});

export const formatedDateFromMs = (ms: number) => dateFormat.format(ms);

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}
