class RoadmapSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title

  has_many :lanes
end
