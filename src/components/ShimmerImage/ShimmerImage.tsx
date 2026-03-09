import { useState, useCallback } from 'react'
import styles from './ShimmerImage.module.scss'

interface ShimmerImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string
}

export function ShimmerImage({
  wrapperClassName,
  className,
  onLoad,
  ...imgProps
}: ShimmerImageProps) {
  const [loaded, setLoaded] = useState(false)

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true)
      onLoad?.(e)
    },
    [onLoad],
  )

  return (
    <div className={`${styles.shimmerWrap} ${wrapperClassName ?? ''}`}>
      {!loaded && <div className={styles.shimmer} aria-hidden="true" />}
      <img
        {...imgProps}
        className={`${styles.img} ${loaded ? styles['img--visible'] : ''} ${className ?? ''}`}
        onLoad={handleLoad}
      />
    </div>
  )
}
