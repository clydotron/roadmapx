class Roadmap < ApplicationRecord
  belongs_to :workspace
  has_many :lanes, -> { order "sort_key ASC" }
end
