class Row < ApplicationRecord
  belongs_to :lane
  has_many :tasks, -> { order "sort_key ASC" }, :dependent => :destroy
end
