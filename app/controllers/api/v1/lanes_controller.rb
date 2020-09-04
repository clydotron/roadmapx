module Api
  module V1
    class LanesController < ApplicationController
      protect_from_forgery with: :null_session
       
      def index
        lanes = Lane.all
        render json: LaneSerializer.new(lanes).serialized_json
      end

      def show
        lane = Lane.find(params[:id])
        render json: LaneSerializer.new(lane).serialized_json
      end

      def create
        lane = roadmap.lanes.new(lane_params)

        if lane.save
          render json: LaneSerializer.new(lane).serialized_json
        else
          render json: {error: review.errors.messages }, status: 422
        end
      end

      def update
        lane = Lane.find(params[:id])
        if lane.update(lane_params)
          render json: LaneSerializer.new(lane).serialized_json
        else
          render json: {error: lane.errors.messages}, status: 422
        end
      end
      
      def destroy
        lane = Lane.find(params[:id])

        if lane.destroy
          head :no_content
        else
          render json: {error: review.errors.messages }, status: 422   
        end
      end

      private

      def roadmap
        @roadmap = Roadmap.find(params[:roadmap_id])
      end

      def lane_params
        params.require(:lane).permit(:title, :color, :roadmap_id, :collapsed, :sort_key)
      end

      def options
        @options ||= { include: %i[tasks]}
      end

    end
  end
end