class Lane < ApplicationRecord
  belongs_to :roadmap
  has_many :task_rows
end
