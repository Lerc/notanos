
# Xterm-256 colors chart
#
(0...256).each_slice(12) do |slice|
  slice.each do |color|
    print "\e[38;5;%dm%4d\e[m \e[48;5;%dm#\e[m" % [color, color, color]
  end
  puts
end
