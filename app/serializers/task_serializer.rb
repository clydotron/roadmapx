class TaskSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title, :color
end
