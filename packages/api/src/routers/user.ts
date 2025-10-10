import { protectedProcedure, router } from "../index";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

export const userRouter = router({
  uploadProfileImage: protectedProcedure
    .input(z.any()) // Multer handles the file, so input schema is flexible
    .mutation(async ({ ctx, input }) => {
      return new Promise((resolve, reject) => {
        upload.single("profileImage")(ctx.req, ctx.res, async (err: any) => {
          if (err) {
            console.error("Multer error:", err);
            return reject(
              new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "File upload failed",
              })
            );
          }

          if (!ctx.req.file) {
            return reject(
              new TRPCError({
                code: "BAD_REQUEST",
                message: "No file uploaded",
              })
            );
          }

          const filePath = `/uploads/${ctx.req.file.filename}`;

          try {
            const updatedUser = await ctx.prisma.user.update({
              where: { id: ctx.session.user.id },
              data: { profileImage: filePath },
            });
            resolve({
              message: "Profile image uploaded successfully",
              profileImage: updatedUser.profileImage,
            });
          } catch (dbError) {
            console.error("Database update error:", dbError);
            // Clean up the uploaded file if database update fails
            fs.unlink(ctx.req.file.path, (unlinkErr) => {
              if (unlinkErr)
                console.error("Error deleting uploaded file:", unlinkErr);
            });
            reject(
              new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to update profile image in database",
              })
            );
          }
        });
      });
    }),
});
