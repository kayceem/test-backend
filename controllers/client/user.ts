import { Request, Response, NextFunction } from "express";
import User from "../../models/User";
import { IUser } from "../../types/user.type";
import Course from "../../models/Course";
import { ICourse } from "../../types/course.type";
import Order from "../../models/Order";
import { BACKEND_URL } from "../../config/backend-domain";
import { getProgressOfCourse, getCoursesOrderByUserId } from "../../utils/helper";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";
import { IDataSelect } from "../../types/dataSelect.type";

interface PublicProfileResponse {
  _id: any;
  name: string;
  avatar: string;
  headline: string;
  biography: string;
  website: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  courses?: ICourse[]; 
}


export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select(
      "_id name avatar email phone headline biography website twitter facebook linkedin youtube language showProfile showCourses"
    );

    if (!user) {
      const error = new CustomError("User", "User not found", 404);
      throw error;
    }

    res.status(200).json({
      message: "Fetch single user successfully!",
      user: user,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch user!", 422);
      return next(customError);
    }
  }
};

export const getAuthors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses: ICourse[] = await Course.find().populate("userId", "_id name");

    const authors: IUser[] = courses.map((course) => course.userId);

    const authorList = [
      ...new Map(
        authors.map((author) => {
          return [author.name, { name: author.name, _id: author._id }];
        })
      ),
    ];

    res.status(200).json({
      message: "Fetch authors successfully!",
      authors: authorList,
    });
  } catch (error) {
    console.log();
    

    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch authors!", 422);
      return next(customError);
    }
  }
};

export const getAuthorsSelect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses: ICourse[] = await Course.find().populate("createdBy", "_id name");
    const authors: IDataSelect[] = courses.map((course) => {
      return {
        label: course?.createdBy?.name,
        value: course?.createdBy?._id.toString()
      }
    });
    const dictAuthor = new Map<string, any>();
    authors.forEach((item) => {
      if (item.value !== undefined) {
        dictAuthor.set(item.value, item)
      }
    })

    const result = [...dictAuthor.values()]

    res.status(200).json(result);
  } catch (error) {

    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch authors!", 422);
      return next(customError);
    }
  }
};

export const getUserDetail = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    const courses = await Order.find({
      "user._id": userId,
    })
      .select("items")
      .populate("items._id");

    const coursesEnrolled = courses
      .map((courseItem) => {
        return courseItem.items;
      })
      .flat()
      .map((item) => item._id)
      .map(async (courseItem) => {
        const progress = (await getProgressOfCourse(courseItem._id, userId)).progress;
        const totalVideosLengthDone = (await getProgressOfCourse(courseItem._id, userId))
          .totalVideosLengthDone;
        const user = await User.findById(courseItem._doc.userId.toString());

        return {
          ...courseItem.toObject(),
          userId: {
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
          },
          progress: progress,
          totalVideosLengthDone,
        };
      });

    const result = {
      ...user.toObject(),
      courses: await Promise.all(coursesEnrolled),
    };

    res.status(200).json({
      message: "Fetch user fetail with fully data successfully!",
      user: result,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch user!", 422);
      return next(customError);
    }
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  let updateData = {
    ...req.body,
  };

  if (req.file) {
    updateData.avatar = `${BACKEND_URL}/${req.file.path}`;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json({
      message: "User updated successfully",
      userId: updatedUser._id,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to updated user!", 422);
      return next(customError);
    }
  }
};

export const getPublicProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select(
      "_id name avatar email phone headline biography website twitter facebook linkedin youtube language showProfile showCourses createdAt updatedAt"
    );

    if (!user) {
      throw new CustomError("User", "User not found", 404);
    }

    if (!user.showProfile) {
      return res.status(403).json({
        message: "User has chosen not to show their profile.",
      });
    }

    let response: PublicProfileResponse = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      headline: user.headline,
      biography: user.biography,
      website: user.socials.website,
      twitter: user.socials.twitter,
      facebook: user.socials.facebook,
      linkedin: user.socials.linkedin,
      youtube: user.socials.youtube,
      language: user.language,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    
    if (user.showCourses) {
      const courses = await getCoursesOrderByUserId(user._id);
      response.courses = courses;
    }

    res.status(200).json({
      message: "Fetch single user publicly successfully!",
      user: response,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch public profile!", 422);
      return next(customError);
    }
  }
};
