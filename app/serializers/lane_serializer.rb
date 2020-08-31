class LaneSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title, :color, :collapsed
  has_many :tasks
end
