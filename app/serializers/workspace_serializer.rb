class WorkspaceSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title
  has_one :roadmap
end
