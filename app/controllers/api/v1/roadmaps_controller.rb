module Api
  module V1
    class RoadmapsController < ApplicationController
      protect_from_forgery with: :null_session
       
      def index
        roadmaps = Roadmap.all
        render json: RoadmapSerializer.new(roadmaps).serialized_json
      end

      def show
        roadmap = Roadmap.find(params[:id])
        render json: RoadmapSerializer.new(roadmap,options).serialized_json
      end

      private

      def options
        @options ||= { include: %i[lanes]}
      end

    end
  end
end