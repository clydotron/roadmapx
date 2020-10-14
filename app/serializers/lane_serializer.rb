class LaneSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title, :color, :collapsed, :sort_key
  has_many :task_rows
end
