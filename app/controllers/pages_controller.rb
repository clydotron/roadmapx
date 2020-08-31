class PagesController < ApplicationController
  def index
  end

  def workspace
    @workspace = Workspace.first
    render json: { data: @workspace }
  end

  def roadmap 
    roadmap = Workspace.first.roadmap
    render json: RoadmapSerializer.new(roadmap).serialized_json
  end
end
