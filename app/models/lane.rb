class Lane < ApplicationRecord
  belongs_to :roadmap
  has_many :rows, :dependent => :destroy
end
