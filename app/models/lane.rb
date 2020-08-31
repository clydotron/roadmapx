class Lane < ApplicationRecord
  belongs_to :roadmap
  has_many :tasks
end
