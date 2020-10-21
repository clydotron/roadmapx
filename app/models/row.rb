class Row < ApplicationRecord
  belongs_to :lane
  has_many :tasks
end
