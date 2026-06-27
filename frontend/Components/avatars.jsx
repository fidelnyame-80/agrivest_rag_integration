import Image from "next/image";

const avatars = [
  "/avatars/1.webp",
  "/avatars/2.webp",
  "/avatars/3.webp",
  "/avatars/4.webp",
  "/avatars/5.webp",
  "/avatars/6.webp",
];

export default function AvatarStack() {
  return (
    <div className="flex items-center">
      {avatars.map((avatar, index) => (
        <div
          key={avatar}
          className="-ml-3 first:ml-0 relative"
          style={{ zIndex: avatars.length - index }}
        >
          <Image
            src={avatar}
            alt="farmImage"
            width={300}
            height={300}
            className="rounded-full w-10 h-10 object-fit"
          />
        </div>
      ))}
    </div>
  );
}