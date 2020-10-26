class RoadmapSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title, :next_lane_id, :onboarding_state
  has_many :lanes
  has_many :rows, through: :lanes
end
