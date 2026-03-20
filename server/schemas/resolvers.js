const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      return User.findById(context.user._id);
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error('Wrong password');
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },

    addApplication: async (
      parent,
      { company, role, status, appliedDate, notes, link },
      context
    ) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      return User.findByIdAndUpdate(
        context.user._id,
        {
          $push: {
            applications: {
              company,
              role,
              status,
              appliedDate,
              notes,
              link,
            },
          },
        },
        { new: true, runValidators: true }
      );
    },

    updateApplication: async (
      parent,
      { applicationId, company, role, status, notes },
      context
    ) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const updateFields = {};

      if (company !== undefined) updateFields['applications.$.company'] = company;
      if (role !== undefined) updateFields['applications.$.role'] = role;
      if (status !== undefined) updateFields['applications.$.status'] = status;
      if (notes !== undefined) updateFields['applications.$.notes'] = notes;

      return User.findOneAndUpdate(
        {
          _id: context.user._id,
          'applications._id': applicationId,
        },
        { $set: updateFields },
        { new: true, runValidators: true }
      );
    },

    removeApplication: async (parent, { applicationId }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      return User.findByIdAndUpdate(
        context.user._id,
        {
          $pull: {
            applications: { _id: applicationId },
          },
        },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;