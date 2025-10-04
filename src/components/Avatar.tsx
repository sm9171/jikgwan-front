import { ImgHTMLAttributes } from 'react'

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
}

export const Avatar = ({
  src,
  alt,
  size = 'md',
  fallback,
  className = '',
  ...props
}: AvatarProps) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg',
  }

  const getFallbackText = () => {
    if (fallback) return fallback
    return alt.charAt(0).toUpperCase()
  }

  if (!src) {
    return (
      <div
        className={`
          ${sizeStyles[size]}
          rounded-full bg-gray-200 flex items-center justify-center
          font-semibold text-gray-600
          ${className}
        `}
      >
        {getFallbackText()}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`
        ${sizeStyles[size]}
        rounded-full object-cover
        ${className}
      `}
      {...props}
    />
  )
}
