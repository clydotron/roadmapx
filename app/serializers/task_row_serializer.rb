class TaskRowSerializer
  include FastJsonapi::ObjectSerializer
  has_many :tasks
end
