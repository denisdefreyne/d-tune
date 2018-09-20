# frozen_string_literal: true

require 'ddmetrics'

module DTune
  module Indexers
    module FS
      class Parser
        def initialize
          @import_durations_summary = DDMetrics::Summary.new
          @track_durations_summary = DDMetrics::Summary.new
          @track_sizes_summary = DDMetrics::Summary.new
        end

        def report
          puts "Import durations (s):"
          puts @import_durations_summary
          puts

          puts "Track durations (min):"
          puts @track_durations_summary
          puts

          puts "Track sizes (MiB):"
          puts @track_sizes_summary
          puts
        end

        def parse_file(filename)
          stopwatch = DDMetrics::Stopwatch.new
          stopwatch.start

          res =
            case File.extname(filename)
            when '.mp3'
              parse_mp3_file(filename)
            when '.m4a'
              parse_m4a_file(filename)
            end

          stopwatch.stop

          @import_durations_summary.observe(stopwatch.duration, ext: File.extname(filename))
          @track_durations_summary.observe(res.fetch(:duration) / 60.0, ext: File.extname(filename))
          @track_sizes_summary.observe(File.stat(filename).size / 1024.0 / 1024, ext: File.extname(filename))

          res
        end

        def parse_mp3_file(filename)
          TagLib::MPEG::File.open(filename) do |file|
            tag = file.id3v2_tag
            props = file.audio_properties

            musicbrainz_frame = tag.frame_list('UFID').find { |f| f.owner == 'http://musicbrainz.org' }

            {
              track_position:     tag.frame_list('TRCK').first.to_s,
              disc_position:      tag.frame_list('TPOS').first.to_s,
              artist:             tag.frame_list('TPE1').first.to_s,
              album_artist:       tag.frame_list('TPE2').first.to_s,
              album:              tag.frame_list('TALB').first.to_s,
              title:              tag.frame_list('TIT2').first.to_s,
              recording_time:     tag.frame_list('TDRC').first.to_s,
              compilation:        tag.frame_list('TCMP').first.to_s.strip == '1',
              label:              tag.frame_list('TPUB').first.to_s,
              isrc:               tag.frame_list('TSRC').first.to_s,
              musicbrainz_id:     musicbrainz_frame&.identifier,
              duration:           props.length,
              bitrate:            props.bitrate,
              channels:           props.channels,
              sample_rate:        props.sample_rate
            }
          end
        end

        def parse_m4a_file(filename)
          TagLib::MP4::File.open(filename) do |file|
            item_list_map = file.tag.item_list_map
            props = file.audio_properties

            xid_strings = (item_list_map['xid ']&.to_string_list || [])
            isrcs = xid_strings.select { |s| s.match?(/:isrc:/) }.map { |s| s.sub(/.*:isrc:/, '') }

            mbid_strings = (item_list_map['----:com.apple.iTunes:MusicBrainz Track Id']&.to_string_list || [])

            label_strings = (item_list_map['----:com.apple.iTunes:Label']&.to_string_list || [])

            {
              track_position:     item_list_map['trkn']&.to_int_pair&.join('/'),
              disc_position:      item_list_map['disc']&.to_int_pair&.join('/'),
              artist:             item_list_map['©ART']&.to_string_list&.first,
              album_artist:       item_list_map['aART']&.to_string_list&.first,
              album:              item_list_map['©alb']&.to_string_list&.first,
              title:              item_list_map['©nam']&.to_string_list&.first,
              recording_time:     item_list_map['©day']&.to_string_list&.first,
              compilation:        item_list_map['©day']&.to_bool,
              label:              label_strings.first,
              isrc:               isrcs.first,
              musicbrainz_id:     mbid_strings.first,
              duration:           props.length,
              bitrate:            props.bitrate,
              channels:           props.channels,
              sample_rate:        props.sample_rate
            }
          end
        end
      end
    end
  end
end
