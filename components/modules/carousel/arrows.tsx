"use client"

import {
  ComponentPropsWithRef,
  FC,
  useCallback,
  useEffect,
  useState
} from 'react'
import { EmblaCarouselType } from 'embla-carousel'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CardIcons from '../card/icons'

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  onPrevButtonClick: () => void
  onNextButtonClick: () => void
}

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  }
}

type PropType = ComponentPropsWithRef<'button'>

export const PrevButton: FC<PropType> = (props) => {
  const { children, ...restProps } = props

  return (
    <button
      className="embla__button embla__button--prev "
      type="button"
      {...restProps}
    >
		<CardIcons
			className={`w-fit h-fit text-center "text-[#000513] border-[1px] ${restProps.disabled ? `border-white/50 via-white/50` : `border-[#1DBBFF] via-[#1DBBFF]/75`} bg-gradient-to-b from-[#000513] to-[#000513]"`}
			icon={(
				<ChevronLeft
					className={`rounded-full p-1 ${restProps.disabled ? `bg-white/25` : `bg-white/75`}`}
				/>
			)}
		/>
      {children}
    </button>
  )
}

export const NextButton: FC<PropType> = (props) => {
  const { children, ...restProps } = props

  return (
    <button
      className="embla__button embla__button--next "
      type="button"
      {...restProps}
    >
    	<CardIcons
			className={`w-fit h-fit text-center "text-[#000513] border-[1px] ${restProps.disabled ? `disabled:border-white/50 disabled:via-white/50` : `border-[#1DBBFF] via-[#1DBBFF]/75`} bg-gradient-to-b from-[#000513] to-[#000513]"`}
			icon={(
				<ChevronRight
					className={`rounded-full p-1 ${restProps.disabled ? `bg-white/25` : `bg-white/75`}`}
				/>
			)}
		/>
      {children}
    </button>
  )
}
