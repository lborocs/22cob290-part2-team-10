export type RoundedRectProps = {
  fill: string
  width?: number
  height?: number
};

// copied the SVG in the header of Toasts in https://getbootstrap.com/docs/5.2/components/toasts/
export default function RoundedRect({
  fill,
  width = 20,
  height = 20,
}: RoundedRectProps) {
  return (
    <svg className="bd-placeholder-img rounded me-2" width={width} height={height} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false">
      <rect width="100%" height="100%" fill={fill} />
    </svg>
  );
}
