import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/apis/user'
import { TEAMS } from '@/constants/teams'

interface UserProfileModalProps {
  userId: number
  onClose: () => void
}

export const UserProfileModal = ({ userId, onClose }: UserProfileModalProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getUserById(userId),
  })

  const user = data?.success ? data.data : null

  const getTeamNames = (teamCodes?: string[]) => {
    if (!teamCodes || teamCodes.length === 0) return '없음'
    return teamCodes
      .map(code => TEAMS.find(t => t.code === code)?.name || code)
      .join(', ')
  }

  const formatGender = (gender?: string) => {
    if (!gender) return '미입력'
    switch (gender) {
      case 'MALE': return '남성'
      case 'FEMALE': return '여성'
      case 'OTHER': return '기타'
      default: return gender
    }
  }

  const formatAgeRange = (ageRange?: string) => {
    if (!ageRange) return '미입력'
    switch (ageRange) {
      case 'TEENS': return '10대'
      case 'TWENTIES': return '20대'
      case 'THIRTIES': return '30대'
      case 'FORTIES': return '40대'
      case 'FIFTIES_PLUS': return '50대 이상'
      default: return ageRange
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">프로필</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        {isLoading && (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        )}

        {error && (
          <div className="py-8 text-center">
            <p className="text-red-500">사용자 정보를 불러올 수 없습니다.</p>
          </div>
        )}

        {user && (
          <div className="space-y-4">
            {/* Profile Image */}
            <div className="flex justify-center">
              {user.profile?.profileImageUrl ? (
                <img
                  src={user.profile.profileImageUrl}
                  alt={user.nickname}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Nickname */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">{user.nickname}</h3>
            </div>

            {/* Profile Info */}
            {user.profile ? (
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 w-20">성별</span>
                  <span className="text-gray-900 font-medium">
                    {formatGender(user.profile.gender)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 w-20">연령대</span>
                  <span className="text-gray-900 font-medium">
                    {formatAgeRange(user.profile.ageRange)}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-20">응원팀</span>
                  <div className="flex-1">
                    {user.profile.supportingTeams && user.profile.supportingTeams.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.profile.supportingTeams.map((teamCode) => {
                          const team = TEAMS.find(t => t.code === teamCode)
                          return (
                            <span
                              key={teamCode}
                              className="px-3 py-1 rounded-full text-sm font-medium text-white"
                              style={{ backgroundColor: team?.color || '#6B7280' }}
                            >
                              {team?.name || teamCode}
                            </span>
                          )
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-400">없음</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">프로필을 아직 작성하지 않았습니다.</p>
              </div>
            )}
          </div>
        )}

        {/* Close Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
