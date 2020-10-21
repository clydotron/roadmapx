class RowSerializer
  include FastJsonapi::ObjectSerializer
  has_many :tasks
end
