export const Loading = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  const Spinner = () => (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-gray-600 text-sm">로딩 중...</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      <Spinner />
    </div>
  )
}
