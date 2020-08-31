class Roadmap < ApplicationRecord
  belongs_to :workspace
  has_many :lanes
end
