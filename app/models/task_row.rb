class TaskRow < ApplicationRecord
  belongs_to :lane
  has_many :tasks
end
